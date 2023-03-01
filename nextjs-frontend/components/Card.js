
export default function Card({ children,tokenId,title,description,price }){

return (<div class="h-full">
        {/* / Card */}
        <div class="max-w-xs mx-auto">
            {children}
            <div class="relative bg-indigo-500 hover:bg-indigo-700 shadow-lg rounded-lg shadow-lg p-5 overflow-hidden">
               
                {/* content */}
                <div class="relative pt-[7.25rem] ">
                    <div class="text-xs font-bold uppercase text-green-400 tracking-widest mb-2">#{tokenId}</div>
                    <h3 class="text-2xl font-extrabold uppercase text-indigo-50 leading-snug mb-2">{title}</h3>
                    <p class="text-indigo-200">{description}</p>
                </div>
                 {/* footer */}
                <div class="relative text-right">
                    <span >Price: </span> <span class="font-bold -mt-px">{price}</span>
                </div>
            </div>
        </div>
    </div>)
}