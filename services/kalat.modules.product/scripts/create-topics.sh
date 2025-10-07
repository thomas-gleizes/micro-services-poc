## Commands
#/opt/kafka/bin/kafka-topics.sh --create --topic CreateProductCommand --bootstrap-server localhost:9092
#/opt/kafka/bin/kafka-topics.sh --create --topic CreateProductCommandReply --bootstrap-server localhost:9092
#/opt/kafka/bin/kafka-topics.sh --create --topic DeleteProductCommand --bootstrap-server localhost:9092
#/opt/kafka/bin/kafka-topics.sh --create --topic DeleteProductCommandReply --bootstrap-server localhost:9092
#/opt/kafka/bin/kafka-topics.sh --create --topic UpdateProductCommand --bootstrap-server localhost:9092
#/opt/kafka/bin/kafka-topics.sh --create --topic UpdateProductCommandReply --bootstrap-server localhost:9092
#
## Queries
#/opt/kafka/bin/kafka-topics.sh --create --topic ReadProductQuery --bootstrap-server localhost:9092
#/opt/kafka/bin/kafka-topics.sh --create --topic ReadProductQueryReply --bootstrap-server localhost:9092
#/opt/kafka/bin/kafka-topics.sh --create --topic ReadProductsQuery --bootstrap-server localhost:9092
#/opt/kafka/bin/kafka-topics.sh --create --topic ReadProductsQueryReply --bootstrap-server localhost:9092

# Events
/opt/kafka/bin/kafka-topics.sh --create --topic ProductCreatedEvent --bootstrap-server localhost:9092
/opt/kafka/bin/kafka-topics.sh --create --topic ProductArchivedEvent --bootstrap-server localhost:9092
/opt/kafka/bin/kafka-topics.sh --create --topic ProductUpdatedEvent --bootstrap-server localhost:9092
/opt/kafka/bin/kafka-topics.sh --create --topic ProductEnabledEvent --bootstrap-server localhost:9092
/opt/kafka/bin/kafka-topics.sh --create --topic ProductDisabledEvent --bootstrap-server localhost:9092
