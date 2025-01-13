import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/login", 
  },
})

export const config = {
  matcher: ["/registration/:path*", "/api/:path*", "/calculator"], 
}
