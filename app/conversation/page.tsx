import Conversation from "@/components/ui/conversation";

export const metadata = {
  title: 'AI Conversation',
};

export default function ConversationPage() {
  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">AI Conversation</h1>
        <Conversation />
      </div>
    </div>
  );
}
