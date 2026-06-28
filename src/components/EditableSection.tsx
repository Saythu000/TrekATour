import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/useAdmin";
import { Edit3, Check, X, Plus, Minus } from "lucide-react";

interface EditableSectionProps {
  title: string;
  content: string | string[];
  onSave: (content: string | string[]) => void;
  type?: 'text' | 'textarea' | 'list';
}

const EditableSection = ({ title, content, onSave, type = 'text' }: EditableSectionProps) => {
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  if (!isAdmin) {
    return (
      <div>
        <h4 className="font-semibold mb-3">{title}</h4>
        {type === 'list' ? (
          <ul className="space-y-2">
            {(content as string[]).map((item, index) => (
              <li key={index} className="flex items-start">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground leading-relaxed">{content as string}</p>
        )}
      </div>
    );
  }

  const handleSave = () => {
    onSave(editContent);
    setIsEditing(false);
    toast({
      title: "Updated successfully",
      description: `${title} has been updated.`
    });
  };

  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  const addListItem = () => {
    if (type === 'list') {
      setEditContent([...(editContent as string[]), ""]);
    }
  };

  const removeListItem = (index: number) => {
    if (type === 'list') {
      const newList = (editContent as string[]).filter((_, i) => i !== index);
      setEditContent(newList);
    }
  };

  const updateListItem = (index: number, value: string) => {
    if (type === 'list') {
      const newList = [...(editContent as string[])];
      newList[index] = value;
      setEditContent(newList);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold">{title}</h4>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-xs"
          >
            <Edit3 className="h-4 w-4 mr-1" />
            Edit
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          {type === 'list' ? (
            <div className="space-y-2">
              {(editContent as string[]).map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => updateListItem(index, e.target.value)}
                    placeholder="Enter item"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeListItem(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addListItem}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          ) : type === 'textarea' ? (
            <Textarea
              value={editContent as string}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              className="resize-none"
            />
          ) : (
            <Input
              value={editContent as string}
              onChange={(e) => setEditContent(e.target.value)}
            />
          )}

          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>
              <Check className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div>
          {type === 'list' ? (
            <ul className="space-y-2">
              {(content as string[]).map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {content as string}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default EditableSection;
