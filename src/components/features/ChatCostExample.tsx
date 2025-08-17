import React from 'react';
import { MoreHorizontal, User, Bot } from 'lucide-react';

const ChatCostExample = () => {
  return (
    <div className="max-w-2xl mx-auto bg-background border border-border rounded-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-muted/30 px-4 py-3 border-b border-border">
        <h4 className="font-semibold text-foreground">Chat with Hobson</h4>
        <p className="text-sm text-muted-foreground">Example conversation showing HEU cost</p>
      </div>
      
      {/* Chat Messages */}
      <div className="p-4 space-y-4 min-h-[300px]">
        {/* User Message */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <div className="bg-muted/50 rounded-lg px-3 py-2 max-w-xs">
              <p className="text-sm text-foreground">When is the next review date?</p>
            </div>
            <div className="text-xs text-muted-foreground mt-1">You • 2:34 PM</div>
          </div>
        </div>

        {/* Hobson Response */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg px-3 py-2 max-w-md">
              <p className="text-sm text-foreground mb-2">
                Based on the lease agreement for 30 River Road, the next rent review is scheduled for <strong>15th March 2025</strong>.
              </p>
              <p className="text-xs text-muted-foreground">
                This is specified in clause 4.2 of the lease document.
              </p>
            </div>
            
            {/* Message Actions */}
            <div className="flex items-center gap-2 mt-1">
              <div className="text-xs text-muted-foreground">Hobson • 2:34 PM</div>
              <button className="p-1 hover:bg-muted rounded">
                <MoreHorizontal className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
            
            {/* HEU Cost Display */}
            <div className="mt-2 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-amber-800 font-medium">HEU Cost:</span>
                <span className="text-amber-900 font-semibold">0.05 HEUs</span>
              </div>
              <p className="text-amber-700 mt-1">Simple query - finds and returns one fact</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Input Area */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-muted/30 rounded-lg px-3 py-2 text-sm text-muted-foreground">
            Ask Hobson about your documents...
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
            Send
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>HEUs remaining: 245.7</span>
          <span>Click ⋯ on any message to see HEU cost</span>
        </div>
      </div>
    </div>
  );
};

export default ChatCostExample;