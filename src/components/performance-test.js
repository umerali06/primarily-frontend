/**
 * Performance test utility for the Primarily-like Items Dashboard
 * This file contains functions to test and measure the performance of different components
 */

// Generate a large dataset for testing
export const generateTestItems = (count = 1000) => {
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push({
      _id: `item-${i}`,
      name: `Test Item ${i}`,
      description: `This is a test item ${i} for performance testing`,
      quantity: Math.floor(Math.random() * 100),
      price: Math.floor(Math.random() * 10000) / 100,
      location: `Location ${Math.floor(i / 100)}`,
      category: `Category ${Math.floor(i / 200)}`,
      tags: [`tag-${i % 10}`, `tag-${i % 5}`],
      images:
        i % 3 === 0 ? [`https://picsum.photos/id/${i % 100}/200/200`] : [],
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 10000000)
      ).toISOString(),
      updatedAt: new Date(
        Date.now() - Math.floor(Math.random() * 1000000)
      ).toISOString(),
      minLevel: Math.floor(Math.random() * 10),
      unit: "pcs",
      folderId: `folder-${Math.floor(i / 50)}`,
    });
  }
  return items;
};

// Measure render time
export const measureRenderTime = (renderFunction, iterations = 5) => {
  const times = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    renderFunction();
    const end = performance.now();
    times.push(end - start);
  }

  const average = times.reduce((sum, time) => sum + time, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);

  return {
    average,
    min,
    max,
    times,
  };
};

// Compare standard vs virtualized rendering
export const compareRenderingMethods = (
  standardRender,
  virtualizedRender,
  itemCounts = [100, 500, 1000, 5000]
) => {
  const results = {};

  for (const count of itemCounts) {
    const items = generateTestItems(count);

    console.log(`Testing with ${count} items...`);

    const standardResults = measureRenderTime(() => standardRender(items));
    const virtualizedResults = measureRenderTime(() =>
      virtualizedRender(items)
    );

    results[count] = {
      standard: standardResults,
      virtualized: virtualizedResults,
      improvement:
        ((standardResults.average - virtualizedResults.average) /
          standardResults.average) *
        100,
    };

    console.log(
      `Standard: ${standardResults.average.toFixed(
        2
      )}ms, Virtualized: ${virtualizedResults.average.toFixed(2)}ms`
    );
    console.log(
      `Performance improvement: ${results[count].improvement.toFixed(2)}%`
    );
  }

  return results;
};

// Measure memory usage
export const measureMemoryUsage = async (renderFunction) => {
  if (!performance.memory) {
    console.warn("Memory measurement not supported in this browser");
    return null;
  }

  const beforeMemory = performance.memory.usedJSHeapSize;
  await renderFunction();
  const afterMemory = performance.memory.usedJSHeapSize;

  return {
    before: beforeMemory / (1024 * 1024), // MB
    after: afterMemory / (1024 * 1024), // MB
    difference: (afterMemory - beforeMemory) / (1024 * 1024), // MB
  };
};

// Run performance tests
export const runPerformanceTests = async () => {
  console.log("Running performance tests...");

  // Test with different item counts
  const itemCounts = [100, 500, 1000, 5000];
  const results = {};

  for (const count of itemCounts) {
    const items = generateTestItems(count);

    console.log(`Testing with ${count} items...`);

    // Standard grid rendering
    const standardGridStart = performance.now();
    // Simulate standard grid rendering
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      // Simulate DOM operations
      const div = document.createElement("div");
      div.textContent = item.name;
      div.setAttribute("data-id", item._id);
      // Don't actually append to DOM to avoid affecting the page
    }
    const standardGridEnd = performance.now();

    // Virtualized grid rendering (simulation)
    const virtualizedGridStart = performance.now();
    // Simulate virtualized rendering (only render visible items)
    const visibleCount = Math.min(50, items.length);
    for (let i = 0; i < visibleCount; i++) {
      const item = items[i];
      // Simulate DOM operations
      const div = document.createElement("div");
      div.textContent = item.name;
      div.setAttribute("data-id", item._id);
      // Don't actually append to DOM to avoid affecting the page
    }
    const virtualizedGridEnd = performance.now();

    results[count] = {
      standard: standardGridEnd - standardGridStart,
      virtualized: virtualizedGridEnd - virtualizedGridStart,
      improvement:
        ((standardGridEnd -
          standardGridStart -
          (virtualizedGridEnd - virtualizedGridStart)) /
          (standardGridEnd - standardGridStart)) *
        100,
    };

    console.log(
      `Standard: ${results[count].standard.toFixed(
        2
      )}ms, Virtualized: ${results[count].virtualized.toFixed(2)}ms`
    );
    console.log(
      `Performance improvement: ${results[count].improvement.toFixed(2)}%`
    );
  }

  console.log("Performance test results:", results);
  return results;
};

// Export test utilities
export default {
  generateTestItems,
  measureRenderTime,
  compareRenderingMethods,
  measureMemoryUsage,
  runPerformanceTests,
};
