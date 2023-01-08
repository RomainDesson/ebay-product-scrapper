import { EbayObjectType } from "../component/home";

export const parseDataToCSV = (data: EbayObjectType[]) => {
    const CSVArray = []
    CSVArray.push(['Titre', 'Prix', 'Référence', 'Condition', 'Image', 'quantity', 'URL'])
    data.forEach((datum) => {
        CSVArray.push([datum.title, datum.price, datum.ref, datum.condition, datum.image, datum.quantity, datum.url])
    })
    return CSVArray
}
