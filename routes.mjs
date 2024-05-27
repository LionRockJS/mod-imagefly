import { RouteList } from '@lionrockjs/central';
RouteList.add('/imagefly/:options(^\\w+)/*', 'controller/ImageFly');