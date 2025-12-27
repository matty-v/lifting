import { test, expect } from '@playwright/test';

/**
 * E2E test for the Lifting Tracker app
 *
 * This test runs through the complete workflow:
 * 1. Initialize a new sheet
 * 2. Create exercises
 * 3. Create a routine with those exercises
 * 4. Submit sets on the routine
 *
 * Requires TEST_SHEET_ID environment variable to be set to a valid
 * Google Sheet ID that has been shared with the service account.
 *
 * Run with: TEST_SHEET_ID=your-sheet-id npx playwright test
 */

const TEST_SHEET_ID = process.env.TEST_SHEET_ID;

test.describe('Lifting Tracker Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start fresh
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('complete workout tracking workflow', async ({ page }) => {
    test.skip(!TEST_SHEET_ID, 'TEST_SHEET_ID environment variable not set');

    // ========================================
    // Step 1: Initialize the sheet
    // ========================================
    await test.step('Initialize sheet connection', async () => {
      // Should show setup wizard
      await expect(page.locator('text=Setup Required')).toBeVisible();

      // Enter sheet ID
      await page.fill('input[placeholder="Paste your Google Sheet ID here"]', TEST_SHEET_ID!);

      // Click Connect
      await page.click('button:has-text("Connect")');

      // Wait for initialization to complete
      await expect(page.locator('text=Initializing')).toBeVisible({ timeout: 5000 }).catch(() => {});

      // Should show tabs after successful connection
      await expect(page.locator('button:has-text("Track")')).toBeVisible({ timeout: 30000 });
      await expect(page.locator('button:has-text("Exercises")')).toBeVisible();
      await expect(page.locator('button:has-text("Routines")')).toBeVisible();
    });

    // ========================================
    // Step 2: Create exercises
    // ========================================
    const exercises = [
      { name: 'Bench Press', pct100: '225', pct90: '205', pct80: '180' },
      { name: 'Squat', pct100: '315', pct90: '285', pct80: '250' },
      { name: 'Deadlift', pct100: '365', pct90: '330', pct80: '290' },
    ];

    await test.step('Create exercises', async () => {
      // Navigate to Exercises tab
      await page.click('button:has-text("Exercises")');

      for (const exercise of exercises) {
        // Wait for Add Exercise button and click it
        const addButton = page.locator('button:has-text("+ Add Exercise")');
        await expect(addButton).toBeVisible({ timeout: 5000 });
        await addButton.click();

        // Wait for the form to appear (indicated by the exercise name input)
        const nameInput = page.locator('input[placeholder="Exercise name"]');
        await expect(nameInput).toBeVisible({ timeout: 5000 });

        // Fill in exercise details
        await nameInput.fill(exercise.name);

        // Fill in percentage weights (within the form)
        const form = page.locator('.bg-gray-50.rounded-lg.border').first();
        const inputs = form.locator('input[type="number"]');
        await inputs.nth(0).fill(exercise.pct100); // 100%
        await inputs.nth(1).fill(exercise.pct90);  // 90%
        await inputs.nth(2).fill(exercise.pct80);  // 80%

        // Save
        await page.click('button:has-text("Save")');

        // Wait for success
        await expect(page.locator('text=Exercise saved')).toBeVisible({ timeout: 10000 });

        // Wait for the form to close (Add Exercise button reappears)
        await expect(addButton).toBeVisible({ timeout: 5000 });

        // Verify exercise appears in list (use first() to handle duplicates from previous runs)
        await expect(page.locator(`text=${exercise.name}`).first()).toBeVisible();
      }

      // Verify all exercises are in the list
      for (const exercise of exercises) {
        await expect(page.locator(`text=${exercise.name}`).first()).toBeVisible();
      }
    });

    // ========================================
    // Step 3: Create a routine
    // ========================================
    const routineName = 'Test Workout';
    const routineItems = [
      { exercise: 'Bench Press', percentage: '80', reps: '5' },
      { exercise: 'Squat', percentage: '80', reps: '5' },
      { exercise: 'Deadlift', percentage: '80', reps: '3' },
    ];

    await test.step('Create routine', async () => {
      // Navigate to Routines tab
      await page.click('button:has-text("Routines")');

      for (let i = 0; i < routineItems.length; i++) {
        const item = routineItems[i];

        // Fill routine name (clear first to ensure clean state)
        const routineInput = page.locator('input[placeholder="Routine name"]');
        await routineInput.clear();
        await routineInput.fill(routineName);

        // Wait for exercise dropdown to be ready and select exercise
        const exerciseSelect = page.locator('select').first();
        await exerciseSelect.selectOption({ label: item.exercise });

        // Select percentage (second select)
        const percentageSelect = page.locator('select').nth(1);
        await percentageSelect.selectOption(item.percentage);

        // Enter reps
        const repsInput = page.locator('input[placeholder="Reps"]');
        await repsInput.clear();
        await repsInput.fill(item.reps);

        // Count existing items before adding
        const existingItems = await page.locator(`text=Exercises in "${routineName}"`).count() > 0
          ? await page.locator('.bg-gray-50.rounded').count()
          : 0;

        // Add
        await page.click('button:has-text("Add")');

        // Wait for the item to appear in the list (more reliable than status message)
        await expect(page.locator(`text=Exercises in "${routineName}"`)).toBeVisible({ timeout: 10000 });

        // Verify this specific exercise appears in the routine list
        const routineSection = page.locator('text=Exercises in').locator('..');
        await expect(routineSection.locator(`text=${item.exercise}`).first()).toBeVisible({ timeout: 5000 });
      }

      // Verify all routine exercises are shown in the routine section
      const routineList = page.locator('text=Exercises in').locator('..').locator('..');
      for (const item of routineItems) {
        // Look for the exercise name in a span within the routine list
        await expect(routineList.locator(`span.font-medium:has-text("${item.exercise}")`).first()).toBeVisible();
      }
    });

    // ========================================
    // Step 4: Track sets on the routine
    // ========================================
    await test.step('Track workout sets', async () => {
      // Navigate to Track tab
      await page.click('button:has-text("Track")');

      // Select the routine (first select on the page)
      const routineSelect = page.locator('select').first();
      await routineSelect.selectOption({ label: routineName });

      // Verify routine checklist appears
      await expect(page.locator(`text=${routineName} Checklist`)).toBeVisible({ timeout: 10000 });

      // Log sets for each exercise
      for (const item of routineItems) {
        // Select exercise (second select on the page)
        const exerciseSelect = page.locator('select').nth(1);
        await exerciseSelect.selectOption({ label: item.exercise });

        // Enter weight (use the 80% weight from exercise definition)
        const exercise = exercises.find(e => e.name === item.exercise)!;
        const weightInput = page.locator('input[placeholder="135"]');
        await weightInput.clear();
        await weightInput.fill(exercise.pct80);

        // Select percentage (third select on the page) - use value format
        const percentageSelect = page.locator('select').nth(2);
        await percentageSelect.selectOption({ value: item.percentage });

        // Enter reps
        const repsInput = page.locator('input[placeholder="5"]');
        await repsInput.clear();
        await repsInput.fill(item.reps);

        // Submit
        await page.click('button:has-text("Log Set")');

        // Wait for the form to process (either success message or checklist update)
        // Use a more flexible wait since the message may disappear quickly
        await page.waitForTimeout(2000);

        // Verify the checklist has been updated (at least one checkmark exists)
        const checkmarks = page.locator('.text-green-600:has-text("✓")');
        const count = await checkmarks.count();
        expect(count).toBeGreaterThan(0);
      }

      // Verify at least some checklist items are complete (have checkmarks)
      // Note: Can't verify exact count due to existing data from previous runs
      const checkmarks = page.locator('.text-green-600:has-text("✓")');
      const count = await checkmarks.count();
      expect(count).toBeGreaterThanOrEqual(routineItems.length);
    });

    // ========================================
    // Step 5: Track body weight
    // ========================================
    await test.step('Track body weight', async () => {
      // Navigate to Weight tab
      await page.click('button:has-text("Weight")');

      // Verify the weight form is visible
      await expect(page.locator('text=Log Body Weight')).toBeVisible();

      // Generate a random weight for testing (between 150-200 lbs)
      const testWeight = (150 + Math.random() * 50).toFixed(1);

      // Enter weight
      const weightInput = page.locator('input[placeholder="199.9"]');
      await weightInput.clear();
      await weightInput.fill(testWeight);

      // Click Record Weight
      await page.click('button:has-text("Record Weight")');

      // Wait for either success message or weight history chart
      // (the chart confirms data was saved even if message disappeared)
      await expect(
        page.locator('text=Weight recorded').or(page.locator('text=Weight History'))
      ).toBeVisible({ timeout: 10000 });

      // Verify weight history chart appears
      await expect(page.locator('text=Weight History')).toBeVisible({ timeout: 5000 });
    });

    // ========================================
    // Step 6: Verify data in Settings
    // ========================================
    await test.step('Verify connection in settings', async () => {
      await page.click('button:has-text("Settings")');
      await expect(page.locator('text=Connected')).toBeVisible();
      await expect(page.locator('text=Open Spreadsheet')).toBeVisible();
    });
  });

  test('shows setup wizard when no sheet configured', async ({ page }) => {
    await page.goto('/');

    // Should show setup required message
    await expect(page.locator('text=Setup Required')).toBeVisible();

    // Should show setup instructions
    await expect(page.locator('text=Create a new Google Sheet')).toBeVisible();
    await expect(page.locator('text=sheets-db-api@kinetic-object-322814.iam.gserviceaccount.com')).toBeVisible();

    // Should have input for sheet ID
    await expect(page.locator('input[placeholder="Paste your Google Sheet ID here"]')).toBeVisible();

    // Connect button should be disabled without input
    await expect(page.locator('button:has-text("Connect")')).toBeDisabled();

    // Should not show tabs
    await expect(page.locator('button:has-text("Track")')).not.toBeVisible();
  });
});
