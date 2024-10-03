export const waitForNavigationAndLoad = async (page, link) => {
  await Promise.all([
    link.click(),
    page.waitForNavigation({ waitUntil: "load" }),
  ]);
};
