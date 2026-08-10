import GlassSectionTitle from "../ui/GlassSectionTitle.jsx";
import IconAgenda from "../icons/IconAgenda.jsx";

export default function AgendaSection({ title, children }) {
  return (
    <div className="my-6">
      <GlassSectionTitle
        icon={<IconAgenda size={26} />}
        title={title}
      />
      {children}
    </div>
  );
}
