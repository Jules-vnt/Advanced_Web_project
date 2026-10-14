import wasteTypesImg from '@/assets/img/waste-types.jpg'
import collectionPointsImg from '@/assets/img/collection-points.jpg'
import collectionsImg from '@/assets/img/collections.jpg'
import treatmentCentersImg from '@/assets/img/treatment-centers.jpg'

// Main sections of the app, shared by the navbar and the home page.
export default [
  {
    to: '/waste-types',
    name: 'waste-types',
    label: 'Waste types',
    image: wasteTypesImg,
    imageAlt: 'A heap of plastic bottles waiting to be recycled',
    description: 'Categories of waste and how each one is recycled.'
  },
  {
    to: '/collection-points',
    name: 'collection-points',
    label: 'Collection points',
    image: collectionPointsImg,
    imageAlt: 'Compost, waste and recycling bins lined up in a park',
    description: 'Bins and drop-off locations across the city.'
  },
  {
    to: '/collections',
    name: 'collections',
    label: 'Collections',
    image: collectionsImg,
    imageAlt: 'Close-up of a blue recycling bin with the recycling symbol',
    description: 'Collection rounds with dates and collected quantities.'
  },
  {
    to: '/treatment-centers',
    name: 'treatment-centers',
    label: 'Treatment centers',
    image: treatmentCentersImg,
    imageAlt: 'Bales of compressed cardboard in a sorting facility',
    description: 'Sites where collected waste is sorted and processed.'
  }
]
