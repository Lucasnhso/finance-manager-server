export async function findPayroll() {
  const response = await fetch(
    process.env.SENIOR_URL! +
      "/payrollregister/recents-paged/EA29DDB94D044B3C88FD60257A088D97?offset=0&limit=3",
    {
      headers: {
        accept: "application/json, text/plain, */*",
        cookie: process.env.SENIOR_COOKIE!,
      },
      body: null,
      method: "GET",
    }
  );
  const { list } = await response.json();
  return list;
}
