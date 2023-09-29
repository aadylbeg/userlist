class APIFeatures {
  constructor(queryString) {
    this.where = `FROM users`;
    this.order = "";
    this.limit = "";
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    if (queryObj.keyword)
      this.where = `${this.where} username LIKE '%${queryObj.keyword}%' OR email LIKE '%${queryObj.keyword}%'`;

    return this;
  }

  sort() {
    if (this.queryString.sort_by && this.queryString.as) {
      this.order = `ORDER BY ${this.queryString.sort_by} ${this.queryString.as}`;
    } else this.order = `ORDER BY id DESC`;

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 20;
    const skip = (page - 1) * limit;

    this.limit = `OFFSET ${skip} LIMIT ${limit}`;
    return this;
  }
}

module.exports = APIFeatures;
