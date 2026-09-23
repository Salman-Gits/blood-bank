import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminRequestList() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/admin/requests", { replace: true });
  }, [navigate]);

  return null;
}
