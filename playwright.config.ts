import { defineConfig, devices } from '@playwright/test';


require('dotenv').config();

export default defineConfig({
  timeout: 40000,
  // globalTimeout: 60000,
  expect:{
    timeout: 2000,
    toMatchSnapshot: {maxDiffPixels: 50}
  },

  retries: 1,
  reporter: [
    process.env.CI ? ["dot"] : ["list"],
    [
      "@argos-ci/playwright/reporter",
      {
        // Upload to Argos on CI only.
        uploadToArgos: !!process.env.CI,
      },
    ],
    ['json', {outputFile: 'test-results/jsonReport.json'}],
    ['junit', {outputFile: 'test-results/junitReport.xml'}],
    // ['allure-playwright'],
    ['html']
  ],

  use: {
    // globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
    baseURL: process.env.DEV === '1' ? 'http://localhost:4201/'
          : process.env.STAGING == '1' ? 'http://localhost:4202/'
          : 'http://localhost:4200/',

    trace: 'on-first-retry',
    screenshot: "only-on-failure",
    actionTimeout: 20000,
    navigationTimeout: 25000,
    video: {
      mode: 'off',
      size: {width: 1920, height: 1080}
    }
  },

  projects: [
    {
      name: 'dev',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200/'
       },
    },
    {
      name: 'chromium',
    },
    {
      name: 'firefox',
      use: {
         browserName: 'firefox',
         video: {
          mode: 'off',
          size: {width: 1920, height: 1080}
        }
        }
    },
    {
      name: 'pageObjectFullScreen',
      testMatch: 'usePageObjects.spec.ts',
      use: {
        viewport: {width: 1920, height: 1080}
      }
    },
    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: {
        ...devices['iPhone 13 Pro']
      }
    }
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200/',
    timeout: 120 * 1000,
  }
});
