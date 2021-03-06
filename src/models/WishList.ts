import { Model, DataTypes, Optional } from 'sequelize';
import { db } from '../services/db';

export class WishList extends Model {
  public product_id!: number;
  public user_id!: number;
}
WishList.init(
  {},
  {
    sequelize: db,
    modelName: 'wishlist',
  }
);
