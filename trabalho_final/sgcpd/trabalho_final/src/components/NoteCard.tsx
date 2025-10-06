"use client";
import CardMenu from "./CardMenu";
import TagPill from "./TagPill";

export default function NoteCard({
  title, content, date, tags, onOpen, onEdit, onDelete
}:{
  title:string; content?:string; date:string;
  tags?:{id:string; name:string}[];
  onOpen:()=>void; onEdit:()=>void; onDelete:()=>void;
}) {
  return (
    <div className="bg-white border rounded-xl shadow-sm p-3 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-2">
        {/* TÍTULO: maior, escuro e com clamp */}
        <h3
          className="text-slate-900 text-[18px] md:text-[20px] leading-snug font-semibold
                    line-clamp-1 cursor-pointer"
          onClick={onOpen}
          title={title}
        >
          {title}
        </h3>

        <CardMenu onEdit={onEdit} onDelete={onDelete}/>
      </div>

      {/* descrição */}
      {content && (
        <p
          className="text-slate-700 text-sm mt-1 line-clamp-3 cursor-pointer"
          onClick={onOpen}
        >
          {content}
        </p>
      )}

      {/* tags */}
      <div className="flex flex-wrap gap-2 mt-3">
        {tags?.map(t => <TagPill key={t.id}>{t.name}</TagPill>)}
      </div>

      {/* data */}
      <div className="text-right text-xs text-slate-500 mt-3">
        {new Date(date).toLocaleDateString()}
      </div>
    </div>
  );
}
