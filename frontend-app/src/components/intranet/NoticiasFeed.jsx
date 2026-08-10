import NoticiaCard from "./NoticiaCard";

export default function NoticiasFeed({ noticias }) {
  return (
    <div className="flex flex-col gap-4">
      {noticias.map(n => (
        <NoticiaCard key={n.id} noticia={n} />
      ))}
    </div>
  );
}
