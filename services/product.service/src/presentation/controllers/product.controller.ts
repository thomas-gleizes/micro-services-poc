import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { CreateProductCommand } from '../../applications/commands/create-product/create-product.command'
import { CreateProductDto } from '../dtos/input/create-product.dto'
import { ReadProductQuery } from '../../applications/queries/read-product/read-product.query'
import { ReadProductsQuery } from '../../applications/queries/read-products/read-products.query'
import { UpdateProductCommand } from '../../applications/commands/update-product/update-product.command'
import { DeleteProductCommand } from '../../applications/commands/delete-product/delete-product.commend'
import { ProductResponseDto } from '../dtos/output/product-response.dto'
import { ProductMapper } from '../../applications/mappers/product.mapper'
import { ProductProps } from '../../domain/entities/product.entity'
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse } from '@nestjs/swagger'
import { ProductsResponseDto } from '../dtos/output/products-response.dto'
import {
  PaginationResult,
  ReadProductModel,
} from '../../domain/repositories/product-query.repository'

@Controller()
export class ProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly productMapper: ProductMapper,
  ) {}

  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'create a product', type: ProductResponseDto })
  async create(@Body() body: CreateProductDto) {
    const product = await this.commandBus.execute<CreateProductCommand, ProductProps>(
      new CreateProductCommand(body),
    )

    return this.productMapper.fromEntity(product)
  }

  @Get('products')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'List of products', type: ProductResponseDto })
  async index(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ProductsResponseDto> {
    const results: PaginationResult<ReadProductModel> = await this.queryBus.execute(
      new ReadProductsQuery(page, limit),
    )

    return {
      meta: results.meta,
      records: results.data.map((product) => this.productMapper.fromReadModel(product)),
    }
  }

  @Get('products/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Get a product',
    type: ProductResponseDto,
  })
  async show(@Param('id') id: string) {
    const product: ReadProductModel = await this.queryBus.execute(new ReadProductQuery(id))

    return this.productMapper.fromReadModel(product)
  }

  @Patch('products/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Update a product', type: ProductResponseDto })
  async update(
    @Param('id') id: string,
    @Body() body: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const product: ProductProps = await this.commandBus.execute(new UpdateProductCommand(id, body))

    return this.productMapper.fromEntity(product)
  }

  @Delete('products/:id')
  @HttpCode(HttpStatus.OK)
  @ApiNoContentResponse({ description: 'Archive a product' })
  async delete(@Param('id') id: string) {
    const product: ProductProps = await this.commandBus.execute(new DeleteProductCommand(id))

    return this.productMapper.fromEntity(product)
  }
}
