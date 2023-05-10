package digital.patron.webmobile.ipTable.repository;

import digital.patron.webmobile.ipTable.domain.IpTable;
import digital.patron.webmobile.ipTable.repository.custom.IpTableRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IpTableRepository extends JpaRepository<IpTable, Long>, IpTableRepositoryCustom {

}
