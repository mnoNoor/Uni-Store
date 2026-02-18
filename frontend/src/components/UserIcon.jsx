import { useState, useEffect } from "react";
import instance from "../lib/axios";

export default function UserIcon() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await instance.get("/auth/user-auth");
        setUser(res.data.user);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div>
      <img src={user.image} className="rounded"></img>
      <h3>{user.username}</h3>
    </div>
  );
}
