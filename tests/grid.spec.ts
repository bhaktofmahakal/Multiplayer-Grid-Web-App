import { test, expect, Page, BrowserContext } from '@playwright/test';

test.describe('Multiplayer Grid Web App', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test.describe('Player Registration', () => {
    test('should display registration form on initial load', async () => {
      // Check for registration heading
      const heading = page.locator('text=Join the Game');
      await expect(heading).toBeVisible();

      // Check for input field
      const input = page.locator('input[placeholder="Enter your player name"]');
      await expect(input).toBeVisible();

      // Check for register button
      const button = page.locator('button:has-text("Register")');
      await expect(button).toBeVisible();
    });

    test('should show error when registering with empty name', async () => {
      const registerButton = page.locator('button:has-text("Register")');
      await registerButton.click();

      const errorAlert = page.locator('.alert-error');
      await expect(errorAlert).toBeVisible();
      await expect(errorAlert).toContainText('Please enter a player name');
    });

    test('should successfully register a player', async () => {
      const input = page.locator('input[placeholder="Enter your player name"]');
      await input.fill('TestPlayer');

      const registerButton = page.locator('button:has-text("Register")');
      await registerButton.click();

      // Check that registration form disappears
      const form = page.locator('.registration');
      await expect(form).not.toBeVisible({ timeout: 5000 });

      // Check that grid appears
      const grid = page.locator('.grid');
      await expect(grid).toBeVisible();

      // Check for success message
      const successAlert = page.locator('.alert-success');
      await expect(successAlert).toContainText('Welcome, TestPlayer!');
    });

    test('should display online players count', async () => {
      const input = page.locator('input[placeholder="Enter your player name"]');
      await input.fill('Player1');

      const registerButton = page.locator('button:has-text("Register")');
      await registerButton.click();

      const playerCount = page.locator('text=Online: 1');
      await expect(playerCount).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Grid Interaction', () => {
    test.beforeEach(async () => {
      // Register a player before each test
      const input = page.locator('input[placeholder="Enter your player name"]');
      await input.fill('GridTestPlayer');

      const registerButton = page.locator('button:has-text("Register")');
      await registerButton.click();

      await page.waitForTimeout(1000);
    });

    test('should display 10x10 grid', async () => {
      const gridCells = page.locator('.grid-cell');
      const cellCount = await gridCells.count();
      expect(cellCount).toBe(100); // 10x10 = 100 cells
    });

    test('should select a cell when clicked', async () => {
      const firstCell = page.locator('.grid-cell').first();
      await firstCell.click();

      await expect(firstCell).toHaveClass(/selected/);
    });

    test('should show selected cell coordinates', async () => {
      // Click cell at position [1,2]
      const cells = page.locator('.grid-cell');
      const cellIndex = 1 * 10 + 2; // row 1, col 2
      await cells.nth(cellIndex).click();

      const cellInfo = page.locator('.cell-info');
      await expect(cellInfo).toContainText('[1, 2]');
    });

    test('should show error when updating without selecting cell', async () => {
      const characterInput = page.locator('input[placeholder="Enter Unicode character"]');
      await characterInput.fill('A');

      const updateButton = page.locator('button:has-text("Update Cell")');
      await updateButton.click();

      const errorAlert = page.locator('.alert-error');
      await expect(errorAlert).toContainText('Please select a cell and enter a character');
    });

    test('should show error when entering multiple characters', async () => {
      const firstCell = page.locator('.grid-cell').first();
      await firstCell.click();

      const characterInput = page.locator('input[placeholder="Enter Unicode character"]');
      await characterInput.fill('ABC');

      const updateButton = page.locator('button:has-text("Update Cell")');
      await updateButton.click();

      const errorAlert = page.locator('.alert-error');
      await expect(errorAlert).toContainText('Please enter exactly one character');
    });

    test('should successfully update a cell with Unicode character', async () => {
      const firstCell = page.locator('.grid-cell').first();
      await firstCell.click();

      const characterInput = page.locator('input[placeholder="Enter Unicode character"]');
      await characterInput.fill('🎮');

      const updateButton = page.locator('button:has-text("Update Cell")');
      await updateButton.click();

      const successAlert = page.locator('.alert-success');
      await expect(successAlert).toContainText('Grid updated successfully');

      // Check that character appears in cell
      await expect(firstCell).toContainText('🎮');
    });

    test('should clear input after successful update', async () => {
      const firstCell = page.locator('.grid-cell').first();
      await firstCell.click();

      const characterInput = page.locator('input[placeholder="Enter Unicode character"]') as any;
      await characterInput.fill('A');

      const updateButton = page.locator('button:has-text("Update Cell")');
      await updateButton.click();

      await page.waitForTimeout(500);

      const inputValue = await characterInput.inputValue();
      expect(inputValue).toBe('');
    });

    test('should support Unicode characters', async () => {
      const unicodeChars = ['🎮', '🚀', '✨', '🔥', '©', '™', '€'];

      for (const char of unicodeChars) {
        const cell = page.locator('.grid-cell').nth(unicodeChars.indexOf(char));
        await cell.click();

        const characterInput = page.locator('input[placeholder="Enter Unicode character"]');
        await characterInput.fill(char);

        const updateButton = page.locator('button:has-text("Update Cell")');
        await updateButton.click();

        await page.waitForTimeout(200);
        await expect(cell).toContainText(char);
      }
    });
  });

  test.describe('Cooldown Mechanism', () => {
    test.beforeEach(async () => {
      const input = page.locator('input[placeholder="Enter your player name"]');
      await input.fill('CooldownTestPlayer');

      const registerButton = page.locator('button:has-text("Register")');
      await registerButton.click();

      await page.waitForTimeout(1000);
    });

    test('should show cooldown timer after update', async () => {
      const firstCell = page.locator('.grid-cell').first();
      await firstCell.click();

      const characterInput = page.locator('input[placeholder="Enter Unicode character"]');
      await characterInput.fill('A');

      const updateButton = page.locator('button:has-text("Update Cell")');
      await updateButton.click();

      await page.waitForTimeout(500);

      // Check for cooldown display
      const cooldownInfo = page.locator('text=/Cooldown:.*/');
      await expect(cooldownInfo).toBeVisible();
    });

    test('should disable update button during cooldown', async () => {
      const firstCell = page.locator('.grid-cell').first();
      await firstCell.click();

      const characterInput = page.locator('input[placeholder="Enter Unicode character"]');
      await characterInput.fill('A');

      const updateButton = page.locator('button:has-text("Update Cell")');
      await updateButton.click();

      await page.waitForTimeout(500);

      // Button should be disabled
      await expect(updateButton).toBeDisabled();

      // Character input should be disabled
      await expect(characterInput).toBeDisabled();
    });

    test('should show remaining cooldown seconds', async () => {
      const firstCell = page.locator('.grid-cell').first();
      await firstCell.click();

      const characterInput = page.locator('input[placeholder="Enter Unicode character"]');
      await characterInput.fill('B');

      const updateButton = page.locator('button:has-text("Update Cell")');
      await updateButton.click();

      await page.waitForTimeout(500);

      // Check for countdown
      const cooldownDisplay = page.locator('button:has-text("Wait")');
      await expect(cooldownDisplay).toBeVisible();
    });

    test('should prevent cell updates during cooldown', async () => {
      const firstCell = page.locator('.grid-cell').first();
      await firstCell.click();

      const characterInput = page.locator('input[placeholder="Enter Unicode character"]');
      await characterInput.fill('X');

      const updateButton = page.locator('button:has-text("Update Cell")');
      await updateButton.click();

      await page.waitForTimeout(500);

      // Try to select another cell
      const secondCell = page.locator('.grid-cell').nth(1);
      await secondCell.click();

      // Input should be disabled, preventing updates
      const characterInput2 = page.locator('input[placeholder="Enter Unicode character"]');
      await expect(characterInput2).toBeDisabled();
    });
  });

  test.describe('Update History', () => {
    test.beforeEach(async () => {
      const input = page.locator('input[placeholder="Enter your player name"]');
      await input.fill('HistoryTestPlayer');

      const registerButton = page.locator('button:has-text("Register")');
      await registerButton.click();

      await page.waitForTimeout(1000);
    });

    test('should have history button', async () => {
      const historyButton = page.locator('button:has-text("Show History")');
      await expect(historyButton).toBeVisible();
    });

    test('should toggle history visibility', async () => {
      let historyPanel = page.locator('.history-panel');
      await expect(historyPanel).not.toBeVisible();

      const historyButton = page.locator('button:has-text("Show History")');
      await historyButton.click();

      await expect(historyPanel).toBeVisible();

      await historyButton.click();
      await expect(historyPanel).not.toBeVisible();
    });

    test('should display update history after cell update', async () => {
      const firstCell = page.locator('.grid-cell').first();
      await firstCell.click();

      const characterInput = page.locator('input[placeholder="Enter Unicode character"]');
      await characterInput.fill('♥');

      const updateButton = page.locator('button:has-text("Update Cell")');
      await updateButton.click();

      await page.waitForTimeout(500);

      // Open history panel
      const historyButton = page.locator('button:has-text("Show History")');
      await historyButton.click();

      const historyPanel = page.locator('.history-panel');
      await expect(historyPanel).toBeVisible();

      // Check for history item
      const historyItems = page.locator('.history-item');
      const itemCount = await historyItems.count();
      expect(itemCount).toBeGreaterThan(0);
    });

    test('should display correct information in history', async () => {
      const firstCell = page.locator('.grid-cell').first();
      await firstCell.click();

      const characterInput = page.locator('input[placeholder="Enter Unicode character"]');
      await characterInput.fill('★');

      const updateButton = page.locator('button:has-text("Update Cell")');
      await updateButton.click();

      await page.waitForTimeout(500);

      // Open history panel
      const historyButton = page.locator('button:has-text("Show History")');
      await historyButton.click();

      const firstHistoryItem = page.locator('.history-item').first();
      
      // Should contain character
      await expect(firstHistoryItem).toContainText('★');

      // Should contain cell coordinates
      await expect(firstHistoryItem).toContainText('[0, 0]');

      // Should contain player name
      await expect(firstHistoryItem).toContainText('HistoryTestPlayer');
    });
  });

  test.describe('Multiplayer Synchronization', () => {
    test('should sync grid updates across multiple players', async ({ browser }) => {
      // Register first player
      const input = page.locator('input[placeholder="Enter your player name"]');
      await input.fill('Player1');

      const registerButton = page.locator('button:has-text("Register")');
      await registerButton.click();

      await page.waitForTimeout(1000);

      // Create second player context
      const context2 = await browser.newContext();
      const page2 = await context2.newPage();
      await page2.goto('/');
      await page2.waitForLoadState('networkidle');

      const input2 = page2.locator('input[placeholder="Enter your player name"]');
      await input2.fill('Player2');

      const registerButton2 = page2.locator('button:has-text("Register")');
      await registerButton2.click();

      await page2.waitForTimeout(1000);

      // Player 1 updates a cell
      const firstCell1 = page.locator('.grid-cell').first();
      await firstCell1.click();

      const characterInput1 = page.locator('input[placeholder="Enter Unicode character"]');
      await characterInput1.fill('🎯');

      const updateButton1 = page.locator('button:has-text("Update Cell")');
      await updateButton1.click();

      await page.waitForTimeout(1500);

      // Check Player 2's grid for the update
      const firstCell2 = page2.locator('.grid-cell').first();
      await expect(firstCell2).toContainText('🎯');

      // Check online players count
      const playerCount1 = page.locator('text=Online: 2');
      await expect(playerCount1).toBeVisible({ timeout: 5000 });

      const playerCount2 = page2.locator('text=Online: 2');
      await expect(playerCount2).toBeVisible({ timeout: 5000 });

      await context2.close();
    });

    test('should update online players count on disconnect', async ({ browser }) => {
      // Register first player
      const input = page.locator('input[placeholder="Enter your player name"]');
      await input.fill('Player1');

      const registerButton = page.locator('button:has-text("Register")');
      await registerButton.click();

      await page.waitForTimeout(1000);

      // Create second player
      const context2 = await browser.newContext();
      const page2 = await context2.newPage();
      await page2.goto('/');
      await page2.waitForLoadState('networkidle');

      const input2 = page2.locator('input[placeholder="Enter your player name"]');
      await input2.fill('Player2');

      const registerButton2 = page2.locator('button:has-text("Register")');
      await registerButton2.click();

      await page2.waitForTimeout(1000);

      // Verify both players are online
      let playerCount = page.locator('text=Online: 2');
      await expect(playerCount).toBeVisible();

      // Disconnect second player
      await context2.close();

      // Wait for disconnection to propagate
      await page.waitForTimeout(2000);

      // First player should see only 1 online
      playerCount = page.locator('text=Online: 1');
      await expect(playerCount).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Keyboard Shortcuts', () => {
    test.beforeEach(async () => {
      const input = page.locator('input[placeholder="Enter your player name"]');
      await input.fill('KeyboardTestPlayer');

      const registerButton = page.locator('button:has-text("Register")');
      await registerButton.click();

      await page.waitForTimeout(1000);
    });

    test('should submit cell update on Enter key', async () => {
      const firstCell = page.locator('.grid-cell').first();
      await firstCell.click();

      const characterInput = page.locator('input[placeholder="Enter Unicode character"]');
      await characterInput.fill('E');

      // Press Enter instead of clicking button
      await characterInput.press('Enter');

      const successAlert = page.locator('.alert-success');
      await expect(successAlert).toContainText('Grid updated successfully');

      await expect(firstCell).toContainText('E');
    });

    test('should submit registration on Enter key', async ({ browser }) => {
      const context = await browser.newContext();
      const newPage = await context.newPage();
      await newPage.goto('/');
      await newPage.waitForLoadState('networkidle');

      const input = newPage.locator('input[placeholder="Enter your player name"]');
      await input.fill('EnterKeyPlayer');

      // Press Enter instead of clicking button
      await input.press('Enter');

      await newPage.waitForTimeout(1000);

      const grid = newPage.locator('.grid');
      await expect(grid).toBeVisible();

      await context.close();
    });
  });

  test.describe('Edge Cases', () => {
    test.beforeEach(async () => {
      const input = page.locator('input[placeholder="Enter your player name"]');
      await input.fill('EdgeCasePlayer');

      const registerButton = page.locator('button:has-text("Register")');
      await registerButton.click();

      await page.waitForTimeout(1000);
    });

    test('should handle rapid cell selections', async () => {
      const cells = page.locator('.grid-cell');

      for (let i = 0; i < 10; i++) {
        await cells.nth(i).click();
      }

      // Last cell should be selected
      const lastSelected = page.locator('.grid-cell.selected');
      const count = await lastSelected.count();
      expect(count).toBe(1);
    });

    test('should handle special Unicode characters', async () => {
      const specialChars = ['™', '©', '®', '°', '₹', '¥', '€', '£'];

      for (const char of specialChars.slice(0, 3)) {
        const cell = page.locator('.grid-cell').nth(specialChars.indexOf(char));
        await cell.click();

        const characterInput = page.locator('input[placeholder="Enter Unicode character"]');
        await characterInput.fill(char);

        const updateButton = page.locator('button:has-text("Update Cell")');
        await updateButton.click();

        await page.waitForTimeout(200);
      }
    });

    test('should maintain grid state on page refresh', async () => {
      const firstCell = page.locator('.grid-cell').first();
      await firstCell.click();

      const characterInput = page.locator('input[placeholder="Enter Unicode character"]');
      await characterInput.fill('R');

      const updateButton = page.locator('button:has-text("Update Cell")');
      await updateButton.click();

      await page.waitForTimeout(1000);

      // Refresh page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Character should still be in grid
      const cell = page.locator('.grid-cell').first();
      await expect(cell).toContainText('R');
    });
  });

  test.describe('Responsive Design', () => {
    test('should be responsive on mobile viewport', async () => {
      await page.setViewportSize({ width: 375, height: 667 });

      const input = page.locator('input[placeholder="Enter your player name"]');
      await input.fill('MobilePlayer');

      const registerButton = page.locator('button:has-text("Register")');
      await registerButton.click();

      await page.waitForTimeout(1000);

      const grid = page.locator('.grid');
      await expect(grid).toBeVisible();

      const cells = page.locator('.grid-cell');
      const cellCount = await cells.count();
      expect(cellCount).toBe(100);
    });

    test('should be responsive on tablet viewport', async () => {
      await page.setViewportSize({ width: 768, height: 1024 });

      const input = page.locator('input[placeholder="Enter your player name"]');
      await input.fill('TabletPlayer');

      const registerButton = page.locator('button:has-text("Register")');
      await registerButton.click();

      await page.waitForTimeout(1000);

      const grid = page.locator('.grid');
      await expect(grid).toBeVisible();
    });
  });
});