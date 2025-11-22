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

interface GlossaryItem {
  id: string;
  term: string;
  definition: string;
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const GLOSSARY_CATEGORIES = [
  "General",
  "Legal Terms",
  "Property Types",
  "Document Types",
  "Technical Terms",
];

export default function GlossaryManagement() {
  const [glossaryItems, setGlossaryItems] = useState<GlossaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<GlossaryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updatingKnowledge, setUpdatingKnowledge] = useState(false);
  const [initialFormData, setInitialFormData] = useState<typeof formData | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    term: "",
    definition: "",
    category: "General",
    sort_order: 1,
    is_active: true,
  });

  const hasFormChanged = initialFormData ? 
    JSON.stringify(formData) !== JSON.stringify(initialFormData) : 
    (formData.term.trim() !== "" || formData.definition.trim() !== "");

  useEffect(() => {
    fetchGlossaryItems();
  }, []);

  const fetchGlossaryItems = async () => {
    try {
      const { data, error } = await supabase
        .from("glossary_items")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setGlossaryItems(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching glossary items",
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
      if (editingItem) {
        const { error } = await supabase
          .from("glossary_items")
          .update(formData)
          .eq("id", editingItem.id);

        if (error) throw error;
        toast({ title: "Glossary term updated successfully" });
      } else {
        const { error } = await supabase.from("glossary_items").insert([formData]);

        if (error) throw error;
        toast({ title: "Glossary term created successfully" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchGlossaryItems();
    } catch (error: any) {
      toast({
        title: "Error saving glossary term",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: GlossaryItem) => {
    setEditingItem(item);
    const itemData = {
      term: item.term,
      definition: item.definition,
      category: item.category,
      sort_order: item.sort_order,
      is_active: item.is_active,
    };
    setFormData(itemData);
    setInitialFormData(itemData);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this glossary term?")) return;

    try {
      const { error } = await supabase.from("glossary_items").delete().eq("id", id);

      if (error) throw error;
      toast({ title: "Glossary term deleted successfully" });
      fetchGlossaryItems();
    } catch (error: any) {
      toast({
        title: "Error deleting glossary term",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setInitialFormData(null);
    setFormData({
      term: "",
      definition: "",
      category: "General",
      sort_order: 1,
      is_active: true,
    });
  };

  const handleImportLegacyGlossary = async () => {
    if (!confirm("This will import 24 glossary terms. Continue?")) return;

    try {
      const { error } = await supabase.functions.invoke("import-legacy-glossary");

      if (error) throw error;
      toast({ title: "Glossary terms imported successfully" });
      fetchGlossaryItems();
    } catch (error: any) {
      toast({
        title: "Error importing glossary terms",
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
          <h1 className="text-3xl font-bold">Glossary Management</h1>
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
              onClick={() => window.location.href = '/admin/faq-management'}
            >
              FAQ Management
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleImportLegacyGlossary} variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import Legacy Glossary
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
                Add Term
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Glossary Term" : "Add New Glossary Term"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="term">Term</Label>
                <Input
                  id="term"
                  value={formData.term}
                  onChange={(e) =>
                    setFormData({ ...formData, term: e.target.value })
                  }
                  required
                  placeholder="e.g., Lease, RTO, Portfolio"
                />
              </div>
              <div>
                <Label htmlFor="definition">Definition</Label>
                <Textarea
                  id="definition"
                  value={formData.definition}
                  onChange={(e) =>
                    setFormData({ ...formData, definition: e.target.value })
                  }
                  required
                  rows={6}
                  placeholder="Enter the definition of the term"
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
                      {GLOSSARY_CATEGORIES.map((cat) => (
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
                  {editingItem ? "Update" : "Create"}
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
              <TableHead>Term</TableHead>
              <TableHead>Definition</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : glossaryItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No glossary terms found. Click "Add Term" to get started.
                </TableCell>
              </TableRow>
            ) : (
              glossaryItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">{item.sort_order}</TableCell>
                  <TableCell className="text-sm">{item.category}</TableCell>
                  <TableCell className="font-semibold">{item.term}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {item.definition}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        item.is_active
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      {item.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
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
