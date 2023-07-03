package com.tvpatron.ipTable.repository;

import com.tvpatron.ipTable.domain.IpTable;
import com.tvpatron.ipTable.repository.custom.IpTableRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IpTableRepository extends JpaRepository<IpTable, Long>, IpTableRepositoryCustom {

}
