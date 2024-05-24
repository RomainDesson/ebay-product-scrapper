import { useState} from 'react'
import axios from 'axios'
import { parseDataToCSV } from "../../utils/parseDataToCSV";
import { CSVLink } from 'react-csv'
import './style.css'

export type EbayObjectType = {
    title: string
    price: string
    image: string
    ref: string
    condition: string
    quantity: string | undefined
    url: string
}
export const Home = () => {
    const [url, setUrl] = useState('')
    const [ebayObjectList, setEbayObjectList] = useState<EbayObjectType[]>([])
    const handleClick = (e: any) => {
        e.preventDefault()
        axios.get(url)
            .then(res => {
                const html = res.data
                const parser = new DOMParser();
                const document = parser.parseFromString(html, "text/html");
                const title = document.querySelector('#LeftSummaryPanel .ux-textspans--BOLD')?.innerHTML ?? ''
                const price = document.querySelector('.x-price-primary .ux-textspans')?.innerHTML ?? ''
                const image = document.querySelector('.ux-image-magnify__container')
                const ref = document.querySelectorAll('.ux-textspans--BOLD')[9]?.innerHTML ?? ''
                const condition = document.querySelector('.ux-icon-text__text')?.querySelector('.clipped')?.innerHTML ?? ''
                let quantity = document.querySelector('#qtySubTxt')?.querySelector('span')?.innerHTML
                const parsedTitle = title?.substring(15, title.length - 9)
                const parsedPrice = price?.substring(15, price?.length - 13)
                // @ts-ignore
                const parsedImage = image?.childNodes[1]?.src

                const parsedCondition = condition

                if (parsedCondition !== 'Occasion' && parsedCondition !== 'Remanufacturé') {
                    quantity = undefined
                } else if (quantity === undefined){
                    quantity = '1'
                } else {
                    quantity = quantity?.substring(0, quantity.length - 14)
                }

                const propsObject: EbayObjectType = {
                    title: title,
                    price: parsedPrice,
                    image: parsedImage,
                    ref: ref,
                    condition: parsedCondition,
                    quantity: quantity,
                    url: url
                }

                return propsObject
            })
            .then(propsObject => {
                const newObjectArray = [...ebayObjectList]
                newObjectArray.push(propsObject)
                setEbayObjectList(newObjectArray)
                setUrl('')
            })

    }

    const csvReport = {
        data: parseDataToCSV(ebayObjectList),
        filename: 'ebay.csv'
    };

    return (
        <div className='container'>
            <form>
                <input onChange={(e) => setUrl(e.target.value)} value={url}/>
                <button onClick={(e) => handleClick(e)} type='submit'>
                    Import
                </button>
            </form>
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
