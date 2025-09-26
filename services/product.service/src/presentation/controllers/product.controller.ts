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
import { CreateProductDto } from '../dtos/input/create-product.dto'
import { ReadProductQuery } from '../../applications/queries/read-product/read-product.query'
import { ReadProductsQuery } from '../../applications/queries/read-products/read-products.query'
import { ProductResponseDto } from '../dtos/output/product-response.dto'
import { ProductMapper } from '../../applications/mappers/product.mapper'
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger'
import { ProductsResponseDto } from '../dtos/output/products-response.dto'
import {
  PaginationResult,
  ReadProductModel,
} from '../../domain/repositories/product-query-repository.interface'
import { UpdateProductDto } from '../dtos/input/update-product.dto'
import { UpdateProductCommand } from '../../applications/commands/update-product/update-product.command'
import { ProductAggregate } from '../../domain/aggregates/product.aggregate'
import { CreateProductCommand } from '../../applications/commands/create-product/create-product.command'
import { EnableProductCommand } from '../../applications/commands/enable-product/enable-product.command'
import { DisableProductCommand } from '../../applications/commands/disable-product/disable-product.command'
import { ArchiveProductCommand } from '../../applications/commands/archive-product/archive-product.command'

@Controller()
export class ProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly productMapper: ProductMapper,
  ) {}

  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a product' })
  @ApiCreatedResponse({ description: 'Created product', type: ProductResponseDto })
  async create(@Body() body: CreateProductDto) {
    const product = await this.commandBus.execute<CreateProductCommand, ProductAggregate>(
      body.toCommand(),
    )

    return this.productMapper.fromAggregate(product)
  }

  @Get('products')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get list of products with pagination' })
  @ApiOkResponse({ description: 'List of products', type: ProductResponseDto })
  async index(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ProductsResponseDto> {
    const results = await this.queryBus.execute<
      ReadProductsQuery,
      PaginationResult<ReadProductModel>
    >(new ReadProductsQuery(page, limit))

    return {
      meta: results.meta,
      records: results.data.map((product) => this.productMapper.fromReadModel(product)),
    }
  }

  @Get('products/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get a product by id' })
  @ApiOkResponse({ type: ProductResponseDto })
  async show(@Param('id') id: string) {
    const product = await this.queryBus.execute<ReadProductQuery, ReadProductModel>(
      new ReadProductQuery(id),
    )

    return this.productMapper.fromReadModel(product)
  }

  @Patch('products/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'update a product' })
  @ApiOkResponse({ type: ProductResponseDto })
  async update(@Param('id') id: string, @Body() body: UpdateProductDto) {
    const aggregate = await this.commandBus.execute<UpdateProductCommand, ProductAggregate>(
      body.toCommand(id),
    )

    return this.productMapper.fromAggregate(aggregate)
  }

  @Patch('products/:id/enable')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'enable a product' })
  @ApiOkResponse({ type: ProductResponseDto })
  async enable(@Param('id') id: string) {
    const aggregate = await this.commandBus.execute<EnableProductCommand, ProductAggregate>(
      new EnableProductCommand(id),
    )

    return this.productMapper.fromAggregate(aggregate)
  }

  @Patch('products/:id/disable')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'disable a product' })
  @ApiOkResponse({ type: ProductResponseDto })
  async disable(@Param('id') id: string) {
    const aggregate = await this.commandBus.execute<DisableProductCommand, ProductAggregate>(
      new DisableProductCommand(id),
    )

    return this.productMapper.fromAggregate(aggregate)
  }

  @Delete('products/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'disable a product' })
  @ApiNoContentResponse()
  async archive(@Param('id') id: string) {
    await this.commandBus.execute<ArchiveProductCommand, ProductAggregate>(
      new ArchiveProductCommand(id),
    )
  }
}
