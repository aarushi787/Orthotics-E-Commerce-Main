export default function VideoGallery({ videoUrl }: {videoUrl:string}) {
  return (
    <div className="mt-4">
      <h3 className="font-semibold text-gray-700 mb-2">Product Video</h3>
      <video src={videoUrl} controls className="w-full rounded-lg border shadow"/>
    </div>
  );
}