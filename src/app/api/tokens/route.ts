import { ACCESS_EXPIRES_IN } from "@/config";
import jwt from "jsonwebtoken";

export async function POST(req: Request, res: Response) {
  try {
    const { accessToken, refreshToken } = await req.json();

    if (!accessToken || !refreshToken) throw new Error();

    jwt.verify(refreshToken, "refresh_secret", (err: any, decode: any) => {
      if (err) throw new Error();
    });

    const newAccessToken = jwt.sign({ id: "1" }, "access_secret", {
      expiresIn: "20s",
    });

    const newRefreshToken = jwt.sign({ id: "1" }, "refresh_secret", {
      expiresIn: "1m",
    });

    return Response.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: new Date().setTime(new Date().getTime() + ACCESS_EXPIRES_IN),
    });
  } catch (err) {
    console.log("\n\n=== REFRESH TOKEN EXPIRED ===\n\n");
    return Response.json({});
  }
}
