export default interface SequelizeResponse<T> {
  dataValues: T;
  isNewRecord: boolean;
  uniqno: number;
}