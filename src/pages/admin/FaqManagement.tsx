import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, Plus, Upload } from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const FAQ_CATEGORIES = [
  "How Hobson works",
  "Getting the best out of Hobson",
  "Hobson Credits",
  "Hobson Technology",
];

export default function FaqManagement() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updatingKnowledge, setUpdatingKnowledge] = useState(false);
  const [initialFormData, setInitialFormData] = useState<typeof formData | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "How Hobson works",
    sort_order: 1,
    is_active: true,
  });

  const hasFormChanged = initialFormData ? 
    JSON.stringify(formData) !== JSON.stringify(initialFormData) : 
    (formData.question.trim() !== "" || formData.answer.trim() !== "");

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const { data, error } = await supabase
        .from("faq_items")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching FAQs",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingFaq) {
        const { error } = await supabase
          .from("faq_items")
          .update(formData)
          .eq("id", editingFaq.id);

        if (error) throw error;
        toast({ title: "FAQ updated successfully" });
      } else {
        const { error } = await supabase.from("faq_items").insert([formData]);

        if (error) throw error;
        toast({ title: "FAQ created successfully" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchFaqs();
    } catch (error: any) {
      toast({
        title: "Error saving FAQ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (faq: FaqItem) => {
    setEditingFaq(faq);
    const faqData = {
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      sort_order: faq.sort_order,
      is_active: faq.is_active,
    };
    setFormData(faqData);
    setInitialFormData(faqData);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      const { error } = await supabase.from("faq_items").delete().eq("id", id);

      if (error) throw error;
      toast({ title: "FAQ deleted successfully" });
      fetchFaqs();
    } catch (error: any) {
      toast({
        title: "Error deleting FAQ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingFaq(null);
    setInitialFormData(null);
    setFormData({
      question: "",
      answer: "",
      category: "How Hobson works",
      sort_order: 1,
      is_active: true,
    });
  };

  const handleImportLegacyFaqs = async () => {
    if (!confirm("This will import all 50 FAQs from the legacy system. Continue?")) return;

    try {
      const { error } = await supabase.functions.invoke("import-legacy-faqs");

      if (error) throw error;
      toast({ title: "FAQs imported successfully" });
      fetchFaqs();
    } catch (error: any) {
      toast({
        title: "Error importing FAQs",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateKnowledgeBase = async () => {
    setUpdatingKnowledge(true);
    try {
      const { data, error } = await supabase.functions.invoke('update-chatbot-knowledge');
      
      if (error) throw error;
      
      const stats = data?.stats || {};
      const preview = data?.preview || {};
      
      const description = `Version ${data.message?.split('version ')[1] || 'latest'}\n📝 ${stats.faqCount || 0} FAQ questions\n💳 ${stats.plansCreditsCount || 0} Plans & Credits\n💡 ${stats.useCasesCount || 0} Use Cases\n📖 ${stats.glossaryCount || 0} Glossary terms${preview.firstFaq ? `\n\nFirst FAQ: ${preview.firstFaq}` : ''}`;
      
      toast({
        title: "Knowledge Base Updated ✓",
        description,
        duration: 8000,
      });
    } catch (error: any) {
      console.error("Error updating knowledge base:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update chatbot knowledge base.",
        variant: "destructive",
      });
    } finally {
      setUpdatingKnowledge(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">FAQ Management</h1>
          <div className="flex gap-2 mt-2">
            <Button
              variant="link"
              className="h-auto p-0 text-sm"
              onClick={() => window.location.href = '/admin'}
            >
              ← Back to Admin
            </Button>
            <span className="text-muted-foreground">|</span>
            <Button
              variant="link"
              className="h-auto p-0 text-sm"
              onClick={() => window.location.href = '/admin/glossary-management'}
            >
              Glossary Management →
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleImportLegacyFaqs} variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import Legacy FAQs
          </Button>
          <Button 
            variant="outline" 
            onClick={updateKnowledgeBase} 
            disabled={updatingKnowledge}
          >
            {updatingKnowledge ? "Updating..." : "Update Knowledge Base"}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add FAQ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingFaq ? "Edit FAQ" : "Add New FAQ"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="question">Question</Label>
                  <Input
                    id="question"
                    value={formData.question}
                    onChange={(e) =>
                      setFormData({ ...formData, question: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="answer">Answer</Label>
                  <RichTextEditor
                    id="answer"
                    value={formData.answer}
                    onChange={(answer) =>
                      setFormData({ ...formData, answer })
                    }
                    rows={10}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FAQ_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sort_order">Sort Order</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sort_order: parseInt(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!hasFormChanged}>
                    {editingFaq ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : faqs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No FAQs found. Click "Import Legacy FAQs" to get started.
                </TableCell>
              </TableRow>
            ) : (
              faqs.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell className="font-mono text-sm">{faq.sort_order}</TableCell>
                  <TableCell className="text-sm">{faq.category}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {faq.question}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        faq.is_active
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      {faq.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(faq)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(faq.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
