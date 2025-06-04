import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { CreateProductCommand } from '../commands/create-product/create-product.command'
import { CreateProductDto } from '../dtos/create-product.dto'
import { ReadProductQuery } from '../queries/read-product/read-product.query'
import { ReadProductsQuery } from '../queries/read-prodcuts/read-products.query'

@Controller()
export class ProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateProductDto) {
    console.log(body)
    return this.commandBus.execute(new CreateProductCommand(body.name, body.price))
  }

  @Get('products')
  @HttpCode(HttpStatus.OK)
  index() {
    return this.queryBus.execute(new ReadProductsQuery())
  }

  @Get('products/:id')
  show(@Param('id') id: string) {
    return this.queryBus.execute(new ReadProductQuery(id))
  }
}
