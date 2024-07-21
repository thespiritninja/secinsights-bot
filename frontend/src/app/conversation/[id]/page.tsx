"use client";
import React from "react";

function ConversationDetails({ params }: { params: { id: string } }) {
  return <div>You&apos;re in conversation: {params.id}</div>;
}

export default ConversationDetails;
