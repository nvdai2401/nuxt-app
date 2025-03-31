export default defineEventHandler(async (event) => {
  // Return folder data
  return [
    {
      id: 1,
      name: "Folder 1",
    },
    {
      id: 2,
      name: "Folder 2",
    },
  ];
});
