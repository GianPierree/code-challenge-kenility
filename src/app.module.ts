import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { LoginService } from './login/login.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonService } from './common/common.service';
import { JwtModule } from '@nestjs/jwt';
import { LoginMiddleware } from './login/login.middleware';
import { ProductsController } from './products/products.controller';
import { JWT_SECRET } from './common/common.constants';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ProductsModule,
    OrdersModule,
    UsersModule,
    MongooseModule.forRoot('mongodb://localhost:27017/code-challenge-kenility'),
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    FilesModule,
  ],
  controllers: [],
  providers: [
    LoginService,
    CommonService,
    LoginMiddleware,
  ],
})
export class AppModule {
  constructor(private readonly loginMiddleware: LoginMiddleware) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(this.loginMiddleware.use.bind(this.loginMiddleware))
      .forRoutes(ProductsController)
  }
}
