
class HangoutDataModel {
    constructor(id, title = "", location = "", distance, image = "", phone_num = "", rating, price = "", details = "", longitude, latitude) {
        this.id = id;
        this.title = title;
        this.location = location;
        this.distance = distance;
        this.image = image;
        this.phone_num = phone_num;
        this.rating = rating;
        this.price = price;
        this.details = details;
        this.longitude = longitude;
        this.latitude = latitude;
    }
}

module.exports = HangoutDataModel;