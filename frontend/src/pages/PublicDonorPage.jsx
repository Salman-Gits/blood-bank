import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PublicDonorPage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/find-donor", { replace: true });
  }, [navigate]);

  return null;
}
