import React, { useState } from 'react';
import { MoreHorizontal, User, Bot, X } from 'lucide-react';

const ChatCostExample = () => {
  const [showUsagePopup, setShowUsagePopup] = useState(true); // Show popup by default to demonstrate

  return (
    <div className="max-w-2xl mx-auto bg-background border border-border rounded-lg overflow-hidden relative">
      {/* Chat Header */}
      <div className="bg-muted/30 px-4 py-3 border-b border-border">
        <h4 className="font-semibold text-foreground">Chat with Hobson</h4>
        <p className="text-sm text-muted-foreground">Click the ⋯ button to see HEU usage</p>
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
              <button 
                className="p-1 hover:bg-muted rounded transition-colors relative"
                onClick={() => setShowUsagePopup(!showUsagePopup)}
              >
                <MoreHorizontal className="w-3 h-3 text-muted-foreground" />
              </button>
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
          <span>HEUs remaining: 245.65</span>
          <span>Click ⋯ on any message to see HEU cost</span>
        </div>
      </div>

      {/* Usage Popup */}
      {showUsagePopup && (
        <>
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10"
            onClick={() => setShowUsagePopup(false)}
          />
          
          {/* Popup */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-background border border-border rounded-lg shadow-lg w-80 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Message Usage</h3>
              <button 
                onClick={() => setShowUsagePopup(false)}
                className="p-1 hover:bg-muted rounded"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">HEU Cost</span>
                  <span className="text-lg font-bold text-blue-900">0.05</span>
                </div>
                <p className="text-xs text-blue-700">Simple query - finds and returns one fact</p>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Query type:</span>
                  <span className="text-foreground">Simple</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Processing time:</span>
                  <span className="text-foreground">0.8s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Documents searched:</span>
                  <span className="text-foreground">1</span>
                </div>
              </div>
              
              <div className="pt-3 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">HEUs before:</span>
                  <span className="text-foreground">245.70</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">HEUs after:</span>
                  <span className="text-foreground">245.65</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatCostExample;