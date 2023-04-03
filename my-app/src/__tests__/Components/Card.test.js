import { render } from '@testing-library/react'
import Card from '../../Components/Card';
import CardCSS from '../../Styles/Card.module.css';


const testItem = {
    "id": "tGepty1IkE_OgtViQTXisQ",
    "alias": "next-level-brooklyn-2",
    "name": "Next Level",
    "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/lkWRI6nB0VU8ViAyYPDWQw/o.jpg",
    "is_closed": false,
    "url": "https://www.yelp.com/biz/next-level-brooklyn-2?adjust_creative=8xWdMn4uhhwa39RE2-yp_Q&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=8xWdMn4uhhwa39RE2-yp_Q",
    "review_count": 21,
    "categories": [
        {
            "alias": "arcades",
            "title": "Arcades"
        },
        {
            "alias": "tabletopgames",
            "title": "Tabletop Games"
        }
    ],
    "rating": 4.5,
    "coordinates": {
        "latitude": 40.6568782,
        "longitude": -74.0021798
    },
    "transactions": [],
    "price": "$",
    "location": {
        "address1": "874 4th Ave",
        "address2": "",
        "address3": "",
        "city": "Brooklyn",
        "zip_code": "11232",
        "country": "US",
        "state": "NY",
        "display_address": [
            "874 4th Ave",
            "Brooklyn, NY 11232"
        ]
    },
    "phone": "+13476188813",
    "display_phone": "(347) 618-8813",
    "distance": 5898.553887523371
}

describe('Card rendering', () => {
    test("Card renders successfully", () => {
        render(<Card
            key={testItem.key}
            onSwipe={(swipeDirection) => handleSwipe(testItem, swipeDirection)}
            title={testItem.name} 
            image={testItem.image_url} 
            distance={testItem.distance} 
            location={testItem.location.display_address[0]}
            location2={testItem.location.display_address[1]}
            phone={testItem.display_phone}
            rating={testItem.rating}
            price={testItem.price}
            details={testItem.categories}
            isTop={true}
          >
          </Card>);
    
        const card = document.querySelector(`.${CardCSS.Container}`)
        expect(card).toBeInTheDocument();
    })
})