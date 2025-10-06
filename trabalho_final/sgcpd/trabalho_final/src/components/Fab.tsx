export default function Fab({ onClick }:{ onClick: ()=>void }) {
  return (
    <button onClick={onClick}
      className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#0e87ff] text-white text-2xl shadow-lg">+</button>
  );
}
