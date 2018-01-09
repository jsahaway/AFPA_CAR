class CarModel
{
    constructor (row) {
        this.row = row || {
            id_car: null,
            model_name: '',
            maker_name: '',
            brand: ''
        };

        this.row.brand = new CarBrandModel(this.row.brand);
    }

    get id() {
        return this.row.id_car;
    }
    set id(val) {
        this.row.id_car = val;
    }

    get model_name() {
        return this.row.model_name;
    }
    set model_name(val) {
        this.row.model_name = val;
    }

    get maker_name() {
        return this.row.maker_name;
    }
    set maker_name(val) {
        this.row.maker_name = val;
    }

    get brand() {
        return this.row.brand;
    }
    set brand(val) {
        this.row.brand = val;
    }

    toJSON() {
        return {
            id: this.id,
            model_name: this.model_name,
            maker_name: this.maker_name,
            brand: this.brand
        };
    }

    isValid() {
        return true;
    }
}

module.exports = CarModel