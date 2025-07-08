import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { CreateProductCommand } from '../../applications/commands/create-product/create-product.command'
import { CreateProductDto } from '../dtos/create-product.dto'
import { ReadProductQuery } from '../../applications/queries/read-product/read-product.query'
import { ReadProductsQuery } from '../../applications/queries/read-prodcuts/read-products.query'
import { UpdateProductCommand } from '../../applications/commands/update-product/update-product.command'
import { DeleteProductCommand } from '../../applications/commands/delete-product/delete-product.commend'

@Controller()
export class ProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateProductDto) {
    return this.commandBus.execute(new CreateProductCommand(body))
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

  @Patch('products/:id')
  update(@Param('id') id: string, @Body() body: CreateProductDto) {
    return this.commandBus.execute(new UpdateProductCommand(id, body))
  }

  @Delete('products/:id')
  delete(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteProductCommand(id))
  }
}
