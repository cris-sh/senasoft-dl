export default function LoadingComponent({ size, text = true }) {
    return (
        <div
            className="w-full h-full py-10 flex flex-col items-center gap-4"
            style={{ marginTop: size / 3 }}
        >
            <span className=" loading loading-infinity loading-xs" style={{ width: size }}></span>
            {text && (
                <span className="text-base-content/90 font-bold" style={{ fontSize: size / 4 }}>
                    Cargando
                </span>
            )}
        </div>
    );
}