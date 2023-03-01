
export default function Card({ children,tokenId,title,description,price }){

return (
        
        <div className="max-w-xs mx-auto ">
            
            <div className="relative bg-indigo-600 hover:bg-indigo-500 bg-opacity-25 hover:bg-opacity-25 shadow-lg rounded-lg shadow-lg p-5 overflow-hidden">
            {children}
                {/* content */}
                <div className="relative pt-[1.25rem] ">
                    <div className="text-xs font-bold uppercase text-green-400 tracking-widest mb-2">#{tokenId}</div>
                    <h3 className="text-2xl font-extrabold uppercase text-indigo-50 leading-snug mb-2">{title}</h3>
                    <p className="text-indigo-200">{description}</p>
                </div>
                 {/* footer */}
                <div className="relative text-right">
                    <span >Price: </span> <span className="font-bold -mt-px">{price}</span>
                </div>
            </div>
        </div>)
}