import Typography from "@/components/Typography"
export default function Loading () {
    return (
        <section className="w-full h-full">
            <div className="flex flex-col gap-7 justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
                <Typography variant="p">Wait a Sec...</Typography>
            </div>
        </section>
    )
}