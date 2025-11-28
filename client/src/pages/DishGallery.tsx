import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { useRoute } from 'wouter';
import { Upload, X, Star } from 'lucide-react';

/**
 * Página de galería de fotos de platos
 * Permite a los organizadores subir y gestionar imágenes de los platos
 */
export default function DishGallery() {
  const { user } = useAuth();
  const [, params] = useRoute('/kermesse/:id/gallery/:dishId');
  const dishId = params?.dishId ? parseInt(params.dishId) : 0;
  const kerMesseId = params?.id ? parseInt(params.id) : 0;

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [captions, setCaptions] = useState<Record<number, string>>({});
  const [uploading, setUploading] = useState(false);

  // Obtener imágenes del plato
  const { data: images = [], isLoading: imagesLoading } =
    trpc.dishImages.getForDish.useQuery(
      { dishId },
      { enabled: dishId > 0 }
    );

  // Obtener información del plato
  const { data: dish } = trpc.dishes.getById.useQuery(
    { id: dishId },
    { enabled: dishId > 0 }
  );

  // Obtener información de la kermesse
  const { data: kermesse } = trpc.kermesses.getById.useQuery(
    { id: kerMesseId },
    { enabled: kerMesseId > 0 }
  );

  const uploadImages = trpc.dishImages.upload.useMutation({
    onSuccess: () => {
      setSelectedFiles([]);
      setCaptions({});
      trpc.useUtils().dishImages.getForDish.invalidate();
    },
  });

  const deleteImage = trpc.dishImages.delete.useMutation({
    onSuccess: () => {
      trpc.useUtils().dishImages.getForDish.invalidate();
    },
  });

  const setMainImage = trpc.dishImages.setMainImage.useMutation({
    onSuccess: () => {
      trpc.useUtils().dishImages.getForDish.invalidate();
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const caption = captions[i] || '';

        // Convertir archivo a base64
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          uploadImages.mutate({
            dishId,
            imageData: base64,
            caption,
            fileName: file.name,
          });
        };
        reader.readAsDataURL(file);
      }
    } finally {
      setUploading(false);
    }
  };

  const isOrganizer = user?.id === kermesse?.organizerId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Galería de {dish?.name}
          </h1>
          <p className="text-slate-600">
            Kermesse: {kermesse?.title}
          </p>
        </div>

        {/* Upload Section - Solo para organizador */}
        {isOrganizer && (
          <Card className="p-6 mb-8 bg-white">
            <h2 className="text-xl font-semibold mb-4 text-slate-900">
              Subir Nuevas Fotos
            </h2>

            <div className="space-y-4">
              {/* File Input */}
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <label className="cursor-pointer">
                  <span className="text-slate-600">
                    Haz clic para seleccionar fotos
                  </span>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-slate-500 mt-2">
                  Puedes seleccionar múltiples imágenes
                </p>
              </div>

              {/* Selected Files Preview */}
              {selectedFiles.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900">
                    Archivos seleccionados ({selectedFiles.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="bg-slate-50 rounded-lg p-4 border border-slate-200"
                      >
                        <p className="text-sm font-medium text-slate-900 truncate mb-2">
                          {file.name}
                        </p>
                        <input
                          type="text"
                          placeholder="Descripción (opcional)"
                          value={captions[index] || ''}
                          onChange={(e) =>
                            setCaptions({
                              ...captions,
                              [index]: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <Button
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || uploading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {uploading ? 'Subiendo...' : 'Subir Fotos'}
              </Button>
            </div>
          </Card>
        )}

        {/* Gallery Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-slate-900">
            Fotos del Plato
          </h2>

          {imagesLoading ? (
            <div className="text-center py-12">
              <p className="text-slate-600">Cargando galería...</p>
            </div>
          ) : images.length === 0 ? (
            <Card className="p-12 text-center bg-white">
              <p className="text-slate-600 mb-4">
                No hay fotos disponibles para este plato
              </p>
              {isOrganizer && (
                <p className="text-sm text-slate-500">
                  Sube fotos usando el formulario arriba
                </p>
              )}
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <Card
                  key={image.id}
                  className="overflow-hidden hover:shadow-lg transition bg-white"
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-slate-100">
                    <img
                      src={image.imageUrl}
                      alt={image.caption || 'Foto del plato'}
                      className="w-full h-full object-cover"
                    />

                    {/* Main Image Badge */}
                    {image.isMainImage && (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-slate-900 px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold">
                        <Star className="w-4 h-4" />
                        Principal
                      </div>
                    )}

                    {/* Actions - Solo para organizador */}
                    {isOrganizer && (
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                        {!image.isMainImage && (
                          <Button
                            size="sm"
                            onClick={() =>
                              setMainImage.mutate({ imageId: image.id })
                            }
                            className="bg-yellow-500 hover:bg-yellow-600"
                          >
                            <Star className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            deleteImage.mutate({ imageId: image.id })
                          }
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Caption */}
                  {image.caption && (
                    <div className="p-4">
                      <p className="text-sm text-slate-600">{image.caption}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
