import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      console.log(
        "\n\n\n======================= NEW REQUEST FROM CLIENT ======================="
      );
      console.log("Token from middleware: ", token); // the old one will be passed
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/"],
};
