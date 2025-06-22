import React from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Emoji from '@tiptap/extension-emoji';
import Link from '@tiptap/extension-link';
import EmojiPicker from 'emoji-picker-react';
import { 
    Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
    List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Smile, Link as LinkIcon
} from 'lucide-react';

import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type FormattingToolbarProps = {
  editor: Editor | null;
};

export const FormattingToolbar = ({ editor }: FormattingToolbarProps) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-input p-2 flex flex-wrap items-center gap-1">
      <Toggle
        size="sm"
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('underline')}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('strike')}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      
      <Separator orientation="vertical" className="h-6 mx-1" />

      <Toggle
        size="sm"
        pressed={editor.isActive({ textAlign: 'left' })}
        onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <AlignLeft className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive({ textAlign: 'center' })}
        onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <AlignCenter className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive({ textAlign: 'right' })}
        onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <AlignRight className="h-4 w-4" />
      </Toggle>
      
      <Popover>
        <PopoverTrigger asChild>
          <Toggle size="sm">
            <Smile className="h-4 w-4" />
          </Toggle>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <EmojiPicker onEmojiClick={(emojiData) => editor.chain().focus().insertContent(emojiData.emoji).run()} />
        </PopoverContent>
      </Popover>
      
      <Separator orientation="vertical" className="h-6 mx-1" />

      <input
        type="color"
        onInput={(event: React.ChangeEvent<HTMLInputElement>) => editor.chain().focus().setColor(event.target.value).run()}
        value={editor.getAttributes('textStyle').color || '#000000'}
        className="w-6 h-6 p-0 border-none bg-transparent"
        title="Text color"
      />
      
      <Separator orientation="vertical" className="h-6 mx-1" />

      <Toggle
        size="sm"
        pressed={editor.isActive('bulletList')}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>

      <Popover>
        <PopoverTrigger asChild>
          <Toggle size="sm" pressed={editor.isActive('link')}>
            <LinkIcon className="h-4 w-4" />
          </Toggle>
        </PopoverTrigger>
        <PopoverContent className="p-2 flex gap-2">
            <Input
                type="text"
                placeholder="https://example.com"
                defaultValue={editor.getAttributes('link').href || ''}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const url = (e.target as HTMLInputElement).value;
                        if (url) {
                            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                        } else {
                            editor.chain().focus().unsetLink().run();
                        }
                    }
                }}
            />
        </PopoverContent>
      </Popover>
    </div>
  );
};

type RichTextEditorProps = {
    content: string;
    onChange: (richText: string) => void;
    className?: string;
};

export const RichTextEditor = ({ content, onChange, className }: RichTextEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                history: false,
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TextStyle,
            Color,
            Emoji.configure({
                enableEmoticons: true,
            }),
            Link.configure({
                openOnClick: true,
                autolink: true,
                HTMLAttributes: {
                    class: 'text-primary underline',
                },
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class:
                    'prose dark:prose-invert prose-sm sm:prose-base focus:outline-none min-h-[200px] p-4',
            },
        },
    });

    return (
        <div className="rounded-md border border-input bg-background">
            <FormattingToolbar editor={editor} />
            <EditorContent editor={editor} className={className} />
        </div>
    );
}; 