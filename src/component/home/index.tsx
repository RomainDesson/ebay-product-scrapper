import { useState} from 'react'
import axios from 'axios'
import { parseDataToCSV } from "../../utils/parseDataToCSV";
import { CSVLink } from 'react-csv'

export type EbayObjectType = {
    title: string,
    price: string,
    image: string,
    ref: string,
    condition: string
    quantity: string | undefined
}
export const Home = () => {
    const [url, setUrl] = useState('')
    const [ebayObjectList, setEbayObjectList] = useState<EbayObjectType[]>([])
    const handleClick = () => {
        axios.get(url)
            .then(res => {
                const html = res.data
                const parser = new DOMParser();
                const document = parser.parseFromString(html, "text/html");
                const title = document.querySelector('#LeftSummaryPanel .ux-textspans--BOLD')?.innerHTML ?? ''
                const price = document.querySelector('.x-price-primary .ux-textspans')?.innerHTML ?? ''
                const image = document.querySelector('.ux-image-carousel-item')
                const ref = document.querySelectorAll('.ux-textspans--BOLD')[7]?.innerHTML ?? ''
                const condition = document.querySelector('.ux-icon-text__text')?.querySelector('.clipped')?.innerHTML ?? ''
                let quantity = document.querySelector('#qtySubTxt')?.querySelector('span')?.innerHTML

                const parsedTitle = title?.substring(15, title.length - 9)
                const parsedPrice = price?.substring(15, price?.length - 13)
                // @ts-ignore
                const parsedImage = image?.childNodes[0].src
                const parsedRef = ref?.substring(15, ref.length - 9)
                const parsedCondition = condition

                if (parsedCondition !== 'Occasion' && parsedCondition !== 'Remanufacturé') {
                    quantity = undefined
                } else if (quantity === undefined){
                    quantity = '1'
                } else {
                    quantity = quantity?.substring(0, quantity.length - 14)
                }

                console.log(quantity)

                const propsObject: EbayObjectType = {
                    title: parsedTitle,
                    price: parsedPrice,
                    image: parsedImage,
                    ref: parsedRef,
                    condition: parsedCondition,
                    quantity: quantity
                }

                return propsObject
            })
            .then(propsObject => {
                const newObjectArray = [...ebayObjectList]
                newObjectArray.push(propsObject)
                setEbayObjectList(newObjectArray)
                console.log(parseDataToCSV(newObjectArray))
            })
    }

    const csvReport = {
        data: ebayObjectList,
        filename: 'ebay.csv'
    };

    return (
        <div>
            <input onChange={(e) => setUrl(e.target.value)}/>
            <button onClick={handleClick}>
                Login to ebay
            </button>
            <ul>
                {ebayObjectList.map((object: EbayObjectType) => (
                    <li id={object.ref}>
                        {object.title}
                    </li>
                ))}
            </ul>
            <CSVLink {...csvReport}>Export to CSV</CSVLink><br /><br />
        </div>
    )
}
