package digital.patron.webmobile.ipTable.repository.custom;

import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.StringTemplate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.stereotype.Repository;

import static digital.patron.webmobile.ipTable.domain.QIpTable.ipTable;


@Repository
public class IpTableRepositoryImpl implements IpTableRepositoryCustom{
    private final JPAQueryFactory queryFactory;

    public IpTableRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public String getCodeByIp(String ip) {
        StringTemplate inputIp = Expressions.stringTemplate("INET_ATON({0})", ip);
        StringTemplate startIp = Expressions.stringTemplate("INET_ATON({0})", ipTable.startIp);
        StringTemplate endIp = Expressions.stringTemplate("INET_ATON({0})", ipTable.endIp);
        return queryFactory
                .select(ipTable.code)
                .from(ipTable)
                .where(inputIp.between(startIp,endIp))
                .fetchFirst();
    }
}
