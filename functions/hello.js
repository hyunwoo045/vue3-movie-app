exports.handler = async function () {
  return {
    statusCode: 200,
    body: JSON.stringify({
      name: "HEROPY",
      age: 85,
      email: "thesecon@gmail.com",
    }),
  };
};
