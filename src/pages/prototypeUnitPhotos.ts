export type UnitPhoto = { id: string; url: string; name: string };
export type UnitPhotographs = { photos?: UnitPhoto[]; mainPhotoId?: string };

export function mainUnitPhoto(unit: UnitPhotographs): UnitPhoto | undefined {
  return unit.photos?.find(p => p.id === unit.mainPhotoId) ?? unit.photos?.[0];
}

export function removeUnitPhoto(unit: UnitPhotographs, id: string): UnitPhotographs {
  const photos = unit.photos?.filter(p => p.id !== id) ?? [];
  return { photos, mainPhotoId: photos.some(p => p.id === unit.mainPhotoId) ? unit.mainPhotoId : photos[0]?.id };
}